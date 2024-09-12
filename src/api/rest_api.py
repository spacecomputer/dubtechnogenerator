def setup_api_routes(app, music_generator, synthesizer):
    @app.route("/api/generate", methods=["POST"])
    def api_generate_music():
        music_data = music_generator.generate()
        audio = synthesizer.synthesize(music_data)
        return {"status": "success", "audio": audio}
