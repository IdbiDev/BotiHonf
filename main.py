import http.server
import socketserver
import os
import json
messages = []
PORT = 8000
old = ""
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow requests from any origin
        self.send_header('Access-Control-Allow-Methods', 'POST')  # Allow POST requests
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')  # Allow Content-Type header

        http.server.SimpleHTTPRequestHandler.end_headers(self)

    def guess_type(self, path):
        if path.endswith('.css'):
            return 'text/css'
        return http.server.SimpleHTTPRequestHandler.guess_type(self, path)

    def do_POST(self):
        global old
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        # Decode JSON data sent from JavaScript
        data = json.loads(post_data.decode('utf-8'))
#         if data == old:
#             return
        # Print received data
        indexes = {0: "A", 1: "B", 2: "C"}
        messages.append(data)

        old = data
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Data received successfully.")
        os.system("cls")
        print("-" * 65)
        for x in messages:
            print(f"{x['count']}. Téma: {x['theme']}")
            print(f"{x['question']}")
            print(f"Helyes válasz: {x['correct_answer']} ({indexes[x['index']]})")
            print("-" * 65)

# Set the current working directory as the directory to serve files from
web_dir = os.path.join(os.path.dirname(__file__), '')
os.chdir(web_dir)

# Create the server
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print("Serving at port", PORT)

    # Start the server
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")
        httpd.server_close()