from flask import Flask, render_template, jsonify
from src.generators.infinite_music import InfiniteMusicGenerator
from src.audio.synthesizer import Synthesizer
from src.api.rest_api import setup_api_routes

app = Flask(__name__)

# Initialize core components
music_generator = InfiniteMusicGenerator()
synthesizer = Synthesizer()

# Setup API routes
setup_api_routes(app, music_generator, synthesizer)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate")
def generate_music():
    # This is a placeholder. In the full implementation, we'll generate music here.
    return jsonify({"status": "Music generation not yet implemented"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
