# 🧠 LSBM Steganography Web App

A simple Flask-based web application to embed and extract secret messages in images using the LSBM (Least Significant Bit Matching) algorithm.

## ✨ Features

- Embed secret messages inside images using LSBM
- Extract messages from stego images
- Intuitive web interface (HTML/CSS/JS)
- Fully Python-powered using Flask & Pillow

## 🛠 Built With

- Python
- Flask
- Pillow (image processing)
- HTML, CSS, JavaScript

## 🚀 Live Demo

Visit on Render: [https://your-app-name.onrender.com](https://your-app-name.onrender.com)  
> *(Replace with your actual Render link after deployment)*

## 📁 Project Structure
.
├── app.py # Main Flask app
├── stego.py # LSBM embed/extract logic
├── templates/
├── static/
├── upload/
├── requirements.txt
└── .render.yaml


## ⚙️ Deployment (Render.com)

1. Push project to GitHub
2. Go to [https://render.com](https://render.com)
3. Create new Web Service → connect GitHub repo
4. Render will auto-detect your `.render.yaml`
5. Wait for build & access your public URL 🎉

## 🧪 Local Development

```bash
pip install -r requirements.txt
python app.py
Then open: http://localhost:5000
```
## 📌 Notes
- Only PNG images are fully supported (JPG may cause decoding errors)
- Do not use lossy-compressed images for embedding

## 📃 License
Free to use for educational purposes.