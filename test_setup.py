import PIL
import customtkinter as ctk
from PIL import Image

# Check versions
print(f"Pillow version: {PIL.__version__}")
print(f"CustomTkinter version: {ctk.__version__}")

# Try to open a window
app = ctk.CTk()
app.geometry("300x200")
app.title("PixelGuard Setup Success")

label = ctk.CTkLabel(app, text="Environment Ready!", font=("Arial", 20))
label.pack(expand=True)

print("Check your taskbar for the success window!")
app.mainloop()