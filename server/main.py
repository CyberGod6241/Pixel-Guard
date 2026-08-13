

import os
import io
import base64
from flask import Flask, request, send_file, send_from_directory, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from scipy.fft import dctn, idctn
from werkzeug.utils import secure_filename # Cleans the filename for safety

# Cryptography Imports for AES-256
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

app = Flask(__name__)

# Ensure upload directory exists on app load
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure CORS - allow requests from any origin or set FRONTEND_URL in env
FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
CORS(app, resources={
    r"/encode": {"origins": FRONTEND_URL, "methods": ["POST", "OPTIONS"]},
    r"/decode": {"origins": FRONTEND_URL, "methods": ["POST", "OPTIONS"]},
    r"/uploads/*": {"origins": FRONTEND_URL, "methods": ["GET", "OPTIONS"]},
    r"/health": {"origins": "*", "methods": ["GET"]}
})

 # This allows your React app to talk to this API
 
 # --- AES-256 Cryptographic Helpers ---

def derive_key(password: str, salt: bytes) -> bytes:
    """Derive a 256-bit key from a user password using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(password.encode())
 
def encrypt_message(plaintext: str, password: str) -> str:
    """Encrypt text using AES-256-GCM with a salt and nonce"""
    salt = os.urandom(16)
    key = derive_key(password, salt)
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plaintext.encode(), None)
    
    # Combine salt + nonce + ciphertext
    combined = salt + nonce + ciphertext
    return "AES:" + base64.b64encode(combined).decode('utf-8')

def decrypt_message(encrypted_str: str, password: str) -> str:
    """Decrypt AES-256-GCM encrypted payload"""
    if not encrypted_str.startswith("AES:"):
        return encrypted_str
    
    try:
        b64_data = encrypted_str[4:]
        data = base64.b64decode(b64_data)
        salt = data[:16]
        nonce = data[16:28]
        ciphertext = data[28:]
        
        key = derive_key(password, salt)
        aesgcm = AESGCM(key)
        
        decrypted = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted.decode('utf-8')
    except Exception:
        raise ValueError("Incorrect password or corrupted ciphertext.")
# --- Steganography Core Logic ---
 

# ---Encoding ---

#4 splitting images int 8x8 block 
def split_image_into_blocks(save_path):
    # 1. Open the image and ensure it's RGB (no alpha channel)
    img = Image.open(save_path)
    # Convert to RGB to remove any alpha channel
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    width, height = img.size

    new_width = (width // 8) * 8
    new_height = (height // 8) * 8
    
    print(f"Original Image Size: {width}x{height}")
    print(f"Image mode: {img.mode}")
    
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
    
    print(f"Message to encode: '{message}'")
    print(f"Message with delimiter: '{message_with_delimiter}'")
    print(f"Binary message ({len(message_binary)} bits): {message_binary[:80]}...")

    for block_idx, block_info in enumerate(blocks):
        if bit_index >= len(message_binary):
            break

        block = block_info["data"]
        # Ensure block is RGB
        if block.mode != 'RGB':
            block = block.convert('RGB')
            block_info["data"] = block
        
        # Convert your Pillow 8x8 block into a NumPy float array
        # We use three color channels (red, green, blue)
        rgb_array = np.array(block, dtype=np.float32)
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
            
            # Embed using Quantization Index Modulation (Q-factor)
            Q = 32.0  # The 'strength' of the embedding. 32 survives spatial rounding perfectly.
            value = dct_coefficients[4, 4]
            
            # Divide by Q and round to nearest integer
            val_rounded = round(value / Q)
            
            # Check if the even/odd parity matches our secret bit
            if (val_rounded % 2) != secret_bit:
                # If it doesn't match, push it to the next step
                val_rounded += 1
                
            # Multiply back by Q and put it in the matrix
            dct_coefficients[4, 4] = float(val_rounded * Q)
            
            # Transform back to spatial domain
            stego_channel = idctn(dct_coefficients, norm='ortho')
            # Clip values to valid pixel range and convert back to uint8
            stego_channel = np.clip(stego_channel, 0, 255).astype(np.uint8)
            # Place the modified channel back into the RGB array
            stego_rgb_array[:, :, i] = stego_channel
            
            if block_idx == 0 and bit_index < 8:
                print(f"Block 0, channel {i}, bit {bit_index}: embedded bit {secret_bit} using QIM, Q=32, coef {value:.2f} -> quantized {val_rounded} -> scaled {val_rounded * Q}")

            bit_index += 1
            # If we've embedded all bits, copy the remaining channels without modification
        stego_block = Image.fromarray(stego_rgb_array.astype(np.uint8), mode='RGB')
        # Update the block data with the modified block containing the hidden message
        block_info["data"] = stego_block

    print(f"Total bits embedded: {bit_index}/{len(message_binary)}")
    return blocks


# --- Decoding ---
def reconstruct_image_from_blocks(blocks, original_width, original_height):
    """Reconstruct the full image from modified 8x8 blocks using direct pixel assignment"""
    # Create a full-size array to hold all pixels
    full_image_array = np.zeros((original_height, original_width, 3), dtype=np.uint8)
    
    # Place each modified block back into the array
    for block_info in blocks:
        x = block_info["x"]
        y = block_info["y"]
        block = block_info["data"]
        
        # Convert block to numpy array
        block_array = np.array(block.convert('RGB'), dtype=np.uint8)
        
        # Place the block array into the correct position
        full_image_array[y:y+8, x:x+8] = block_array
    
    # Create image from the full array
    stego_image = Image.fromarray(full_image_array, mode='RGB')
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
        # Ensure it's RGB
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        width, height = img.size
        
        new_width = (width // 8) * 8
        new_height = (height // 8) * 8
        
        print(f"Extracting from image size: {width}x{height}")
        print(f"Image mode: {img.mode}")
        print(f"Processing blocks: {(new_width//8) * (new_height//8)} blocks")
        
        # Extract all bits
        extracted_bits = []
        
        for y in range(0, new_height, 8):
            for x in range(0, new_width, 8):
                # Crop the 8x8 block
                box = (x, y, x + 8, y + 8)
                block = img.crop(box)
                
                # Ensure block is RGB
                if block.mode != 'RGB':
                    block = block.convert('RGB')
                
                # Convert to RGB array
                rgb_array = np.array(block, dtype=np.float32)
                
                # Extract from each channel
                for i in range(3):
                    channel = rgb_array[:, :, i]
                    # Transform to frequency domain
                    dct_coefficients = dctn(channel, norm='ortho')
                    
                    # Get the coefficient at [4, 4]
                    value = dct_coefficients[4, 4]
                    
                    # Read the bit using the exact same Q-factor
                    Q = 32.0
                    val_rounded = int(round(value / Q))
                    lsb = val_rounded % 2
                    
                    extracted_bits.append(str(lsb))
        
        print(f"Total bits extracted: {len(extracted_bits)}")
        print(f"First 80 bits: {''.join(extracted_bits[:80])}")
        
      # Convert bits back to characters
        message = ""
        
        for i in range(0, len(extracted_bits) - 7, 8):
            byte_str = ''.join(extracted_bits[i:i+8])
            char_code = int(byte_str, 2)
            
            try:
                char = chr(char_code)
                message += char
            except Exception as e:
                # Silently ignore invalid characters (happens in the noise after the message)
                continue
            
            # Check for delimiter ONCE
            if message.endswith('#####'):
                message = message[:-5]  # Remove the delimiter
                print(f"Delimiter found! Extracted message: {message}")
                return message
        
        # If the loop finishes and no delimiter was found:
        print(f"No delimiter found. Extracted {len(message)} characters.")
        return None
        
      #   # If no delimiter found, the message might be corrupted or not steganographic
      #   print(f"No delimiter found. Extracted {len(message)} characters: {repr(message)}")
      #   print(f"Last 50 chars: {repr(message[-50:]) if len(message) > 50 else repr(message)}")
      #   return None
        
    except Exception as e:
        print(f"Error extracting message: {str(e)}")
        return None

# --- API Routes ---

@app.route('/encode', methods=['POST'])
def encode():
    try:
        UPLOAD_FOLDER = 'uploads'
        app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        # 1. Get image, message, AND password from React
        file = request.files.get('image')
        message = request.form.get('message')
        password = request.form.get('password')  # <--- ADDED

        if not file or not message:
            return jsonify({"status": "error", "message": "Missing image or message"}), 400

        # 2. Encrypt message if password was provided
        if password and password.strip():  # <--- ADDED
            message = encrypt_message(message, password.strip())

        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        max_capacity = get_max_capacity(save_path)
        if len(message) + 5 > max_capacity:
            os.remove(save_path)
            return jsonify({"error": f"Message too long! Max allowed: {max_capacity - 5} characters."}), 400
        
        blocks, width, height = split_image_into_blocks(save_path)
        encode_message_in_blocks(blocks, message)
        
        stego_image = reconstruct_image_from_blocks(blocks, width, height)
        
        name_without_ext = os.path.splitext(filename)[0]
        stego_filename = f"stego_{name_without_ext}.png"
        stego_path = os.path.join(app.config['UPLOAD_FOLDER'], stego_filename)
        stego_image.save(stego_path, format='PNG')
        
        return jsonify({"status": "success", "path": stego_filename})

    except Exception as e:
        print(f"Error in encode endpoint: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
   """Health check endpoint to verify server is running"""
   uploads_exist = os.path.exists('uploads')
   return jsonify({
      "status": "ok",
      "uploads_folder_exists": uploads_exist,
      "uploads_path": os.path.abspath('uploads')
   })

@app.route('/decode', methods=['POST', 'OPTIONS'])
def decode():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        file = request.files.get('image')
        password = request.form.get('password')  # <--- ADDED
        
        if not file:
            return jsonify({"status": "error", "message": "No image file provided."}), 400
        
        UPLOAD_FOLDER = 'uploads'
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        filename = secure_filename(file.filename)
        if not filename:
            return jsonify({"status": "error", "message": "Invalid filename"}), 400
        
        temp_path = os.path.join(UPLOAD_FOLDER, f"decode_temp_{filename}")
        file.save(temp_path)
        
        try:
            extracted_message = extract_message_from_image(temp_path)
            
            if extracted_message is None:
                return jsonify({"status": "error", "message": "No steganographic data found."}), 400
            
            # Check if extracted text is AES encrypted
            if extracted_message.startswith("AES:"):  # <--- ADDED
                if not password or not password.strip():
                    return jsonify({"status": "error", "message": "This image is password-protected. Please enter a password."}), 400
                
                try:
                    extracted_message = decrypt_message(extracted_message, password.strip())
                except ValueError:
                    return jsonify({"status": "error", "message": "Decryption failed! Incorrect password."}), 400
            
            return jsonify({
                "status": "success",
                "message": extracted_message
            })
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    except Exception as e:
        print(f"Error in decode endpoint: {str(e)}")
        return jsonify({"status": "error", "message": f"Server error: {str(e)}"}), 500

@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename):
    """Serve encoded stego images safely using Flask's send_from_directory"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)