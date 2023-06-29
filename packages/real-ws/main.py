import debugpy
debugpy.listen(("0.0.0.0", 5679))

from genworlds.sockets.world_socket_server import start_from_command_line

if __name__ == "__main__":
    start_from_command_line()