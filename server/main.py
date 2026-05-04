

from flask import Flask, request ,send_file , jsonify
from flask_cors import CORS
import io
import os
from werkzeug.utils import secure_filename # Cleans the filename for safety

app = Flask(__name__)
cors = CORS(app)
 # This allows your React app to talk to this API

@app.route('/encode', methods=['POST'])
def encode():
   # return jsonify({
   #    "users": [
   #       "alice",
   #       "zach",
   #       "jessie"]
   # })

   UPLOAD_FOLDER = 'uploads'
   app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

   if not os.path.exists(UPLOAD_FOLDER):
      os.makedirs(UPLOAD_FOLDER)

   # 1. Get image and text from React
   file = request.files['image']
   message = request.form['message']

   if file:
      # 2. Secure the name (prevents hackers from naming a file '../../config.sys')
      filename = secure_filename(file.filename)
      
      # 3. THE MAGIC MOMENT: This saves the file to your 'uploads' folder
      save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
      file.save(save_path)
      
      print(f"Image saved to: {save_path}")
      print(f"Secret message to hide: {message}")
      
      # Next: Pass 'save_path' to your Steganography function...
      return {"status": "success", "path": save_path}

   return jsonify({"status": "error", "message": "No file provided"})

if __name__ == '__main__':
   app.run(debug=True, port=8080)