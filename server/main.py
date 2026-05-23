

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from scipy.fft import dctn, idctn
import io
import os
from werkzeug.utils import secure_filename # Cleans the filename for safety

app = Flask(__name__)
cors = CORS(app, resources={
    r"/encode": {"origins": "*", "methods": ["POST", "OPTIONS"]},
    r"/decode": {"origins": "*", "methods": ["POST", "OPTIONS"]},
    r"/uploads/*": {"origins": "*", "methods": ["GET", "OPTIONS"]}
})
 # This allows your React app to talk to this API

@app.route('/encode', methods=['POST'])
def encode():
   try:
      UPLOAD_FOLDER = 'uploads'
      app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

      if not os.path.exists(UPLOAD_FOLDER):
         os.makedirs(UPLOAD_FOLDER)

      # 1. Get image and text from React
      file = request.files.get('image')
      message = request.form.get('message')

      if not file or not message:
         return jsonify({"status": "error", "message": "Missing image or message"}), 400

      # 2. Secure the name (prevents hackers from naming a file '../../config.sys')
      filename = secure_filename(file.filename)
      
      # 3. Save the file to your 'uploads' folder
      save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
      file.save(save_path)

      max_capacity = get_max_capacity(save_path)
      # Check if message fits (add buffer for your delimiter)
      if len(message) + 5 > max_capacity: # +5 for the '#####' delimiter
         os.remove(save_path)  # Clean up
         return jsonify({"error": f"Message too long! Max allowed: {max_capacity - 5} characters."}), 400
      
      blocks, width, height = split_image_into_blocks(save_path)
      encode_message_in_blocks(blocks, message)
      
      # Reconstruct image from modified blocks
      stego_image = reconstruct_image_from_blocks(blocks, width, height)
      
      # Save the stego image as PNG for consistency
      # Remove the original extension and add .png
      name_without_ext = os.path.splitext(filename)[0]
      stego_filename = f"stego_{name_without_ext}.png"
      stego_path = os.path.join(app.config['UPLOAD_FOLDER'], stego_filename)
      stego_image.save(stego_path, format='PNG')
      
      print(f"Image saved to: {save_path}")
      print(f"Secret message to hide: {message}")
      print(f"Stego image saved to: {stego_path}")
      
      return jsonify({"status": "success", "path": stego_filename})

   except Exception as e:
      print(f"Error in encode endpoint: {str(e)}")
      return jsonify({"status": "error", "message": str(e)}), 500


#4 splitting images int 8x8 block 
def split_image_into_blocks(save_path):
    # 1. Open the image
    img = Image.open(save_path)
    width, height = img.size

    new_width = (width // 8) * 8
    new_height = (height // 8) * 8
    
    print(f"Original Image Size: {width}x{height}")
    
    blocks = []
    
    
    # 2. Loop through rows and columns in steps of 8
    for y in range(0, new_height, 8):
        for x in range(0, new_width, 8):
            
            # 3. Define the bounding box (left, upper, right, lower)
            box = (x, y, x + 8, y + 8)
            
            # 4. Crop the 8x8 block out of the original image
            block = img.crop(box)
            
            # Store the block along with its starting coordinates (crucial for rebuilding later)
            blocks.append({
                "x": x,
                "y": y,
                "data": block
            })
            
    print(f"Total 8x8 blocks created: {len(blocks)}")
    return blocks, new_width, new_height


def encode_message_in_blocks(blocks, message):
    # Add delimiter to mark end of message
    message_with_delimiter = message + '#####'
    # Convert message to binary
    message_binary = ''.join(format(ord(char), '08b') for char in message_with_delimiter)
    bit_index = 0

    for block_info in blocks:
        if bit_index >= len(message_binary):
            break

        block = block_info["data"]
        # Convert your Pillow 8x8 block into a NumPy float array
        # We use three color channels (red, green, blue)
        rgb_array = np.array(block.convert('RGB'), dtype=np.float32)
        # Create an empty array to hold the modified pixel values
        stego_rgb_array = np.zeros_like(rgb_array)

        for i in range(3):
            if bit_index >= len(message_binary):
                stego_rgb_array[:, :, i] = rgb_array[:, :, i]
                continue

            channel = rgb_array[:, :, i]
            # Transform to frequency domain for this channel
            dct_coefficients = dctn(channel, norm='ortho')
            # Get the next bit of the message to embed
            secret_bit = int(message_binary[bit_index])
            #Embed the bit into a mid-frequency coefficient [4, 4]
            value = dct_coefficients[4, 4]
            # Convert the coefficient to an integer (you can also choose to round it)
            co_int = int(value)
            # Modify the least significant bit of the coefficient to embed the secret bit
            modified_co_int = (co_int & ~1) | secret_bit
            # Update the DCT coefficient with the modified integer value
            dct_coefficients[4, 4] = float(modified_co_int)
            # Transform back to spatial domain
            stego_channel = idctn(dct_coefficients, norm='ortho')
            # Clip values to valid pixel range and convert back to uint8
            stego_channel = np.clip(stego_channel, 0, 255).astype(np.uint8)
            # Place the modified channel back into the RGB array
            stego_rgb_array[:, :, i] = stego_channel

            bit_index += 1
            # If we've embedded all bits, copy the remaining channels without modification
        stego_block = Image.fromarray(stego_rgb_array.astype(np.uint8))
        # Update the block data with the modified block containing the hidden message
        block_info["data"] = stego_block

    return blocks

def reconstruct_image_from_blocks(blocks, original_width, original_height):
    """Reconstruct the full image from modified 8x8 blocks"""
    # Create a blank image with the same dimensions as the original
    stego_image = Image.new('RGB', (original_width, original_height))
    
    # Place each modified block back into the image
    for block_info in blocks:
        x = block_info["x"]
        y = block_info["y"]
        block = block_info["data"]
        stego_image.paste(block, (x, y))
    
    return stego_image

def get_max_capacity(image_path):
    img = Image.open(image_path)
    width, height = img.size
    
    # Calculate number of 8x8 blocks
    num_blocks = (width // 8) * (height // 8)
    
    # 3 bits per block (R, G, B channels)
    total_bits = num_blocks * 3
    
    # Convert to characters (each char is 8 bits)
    max_chars = total_bits // 8
    return max_chars

def extract_message_from_image(image_path):
    """Extract hidden message from a stego image"""
    try:
        img = Image.open(image_path)
        width, height = img.size
        
        new_width = (width // 8) * 8
        new_height = (height // 8) * 8
        
        print(f"Extracting from image size: {width}x{height}")
        
        # Extract all bits
        extracted_bits = []
        
        for y in range(0, new_height, 8):
            for x in range(0, new_width, 8):
                # Crop the 8x8 block
                box = (x, y, x + 8, y + 8)
                block = img.crop(box)
                
                # Convert to RGB array
                rgb_array = np.array(block.convert('RGB'), dtype=np.float32)
                
                # Extract from each channel
                for i in range(3):
                    channel = rgb_array[:, :, i]
                    # Transform to frequency domain
                    dct_coefficients = dctn(channel, norm='ortho')
                    # Get the coefficient at [4, 4]
                    value = dct_coefficients[4, 4]
                    # Extract the least significant bit
                    co_int = int(value)
                    lsb = co_int & 1
                    extracted_bits.append(str(lsb))
        
        # Convert bits back to characters
        message = ""
        for i in range(0, len(extracted_bits) - 7, 8):
            byte_str = ''.join(extracted_bits[i:i+8])
            char_code = int(byte_str, 2)
            char = chr(char_code)
            message += char
            
            # Check for delimiter
            if message.endswith('#####'):
                message = message[:-5]  # Remove the delimiter
                print(f"Extracted message: {message}")
                return message
        
        # If no delimiter found, the message might be corrupted or not steganographic
        print(f"No delimiter found. Message might be corrupted.")
        return None
        
    except Exception as e:
        print(f"Error extracting message: {str(e)}")
        return None

@app.route('/health', methods=['GET'])
def health():
   """Health check endpoint to verify server is running"""
   uploads_exist = os.path.exists('uploads')
   return jsonify({
      "status": "ok",
      "uploads_folder_exists": uploads_exist,
      "uploads_path": os.path.abspath('uploads')
   })

@app.route('/decode', methods=['POST'])
def decode():
   """Decode hidden message from stego image"""
   try:
      file = request.files.get('image')
      
      if not file:
         return jsonify({"status": "error", "message": "No image file provided"}), 400
      
      # Save the uploaded file temporarily
      UPLOAD_FOLDER = 'uploads'
      if not os.path.exists(UPLOAD_FOLDER):
         os.makedirs(UPLOAD_FOLDER)
      
      filename = secure_filename(file.filename)
      temp_path = os.path.join(UPLOAD_FOLDER, f"decode_temp_{filename}")
      file.save(temp_path)
      
      try:
         # Extract the hidden message
         extracted_message = extract_message_from_image(temp_path)
         
         if extracted_message is None:
            return jsonify({"status": "error", "message": "This file does not appear to contain steganographic data, or the data may be corrupted."}), 400
         
         return jsonify({
            "status": "success",
            "message": extracted_message
         })
      finally:
         # Clean up temp file
         if os.path.exists(temp_path):
            os.remove(temp_path)
   
   except Exception as e:
      print(f"Error in decode endpoint: {str(e)}")
      return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename):
   """Serve uploaded and encoded images"""
   try:
      secure_name = secure_filename(filename)
      # Use absolute path to avoid issues on Windows
      file_path = os.path.abspath(os.path.join('uploads', secure_name))
      print(f"Attempting to serve: {file_path}")
      print(f"File exists: {os.path.exists(file_path)}")
      
      if not os.path.exists(file_path):
         print(f"File not found: {file_path}")
         return jsonify({"error": f"File not found: {file_path}"}), 404
      
      # Determine mimetype based on file extension
      _, ext = os.path.splitext(file_path)
      ext = ext.lower()
      
      mimetype_map = {
         '.png': 'image/png',
         '.jpg': 'image/jpeg',
         '.jpeg': 'image/jpeg',
         '.webp': 'image/webp',
         '.gif': 'image/gif'
      }
      
      mimetype = mimetype_map.get(ext, 'image/png')
      
      # Read file and serve using BytesIO to avoid path encoding issues on Windows
      with open(file_path, 'rb') as f:
         file_data = f.read()
      
      return send_file(
         io.BytesIO(file_data),
         mimetype=mimetype,
         as_attachment=False,
         download_name=secure_name
      )
   except Exception as e:
      print(f"Error serving file: {str(e)}")
      return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
   # Ensure uploads folder exists on startup
   UPLOAD_FOLDER = 'uploads'
   if not os.path.exists(UPLOAD_FOLDER):
      os.makedirs(UPLOAD_FOLDER)
      print(f"Created uploads folder at: {os.path.abspath(UPLOAD_FOLDER)}")
   else:
      print(f"Uploads folder exists at: {os.path.abspath(UPLOAD_FOLDER)}")
      # List existing files
      files = os.listdir(UPLOAD_FOLDER)
      print(f"Existing files: {files}")
   
   print("Starting Flask server on http://localhost:8080")
   app.run(debug=True, port=8080)