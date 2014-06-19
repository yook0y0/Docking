package socketIO;

import java.util.Map;

import org.vertx.java.core.Handler;
import org.vertx.java.core.Vertx;
import org.vertx.java.core.http.HttpServer;
import org.vertx.java.core.json.JsonObject;

import com.nhncorp.mods.socket.io.SocketIOServer;
import com.nhncorp.mods.socket.io.SocketIOSocket;
import com.nhncorp.mods.socket.io.impl.DefaultSocketIOServer;
import com.nhncorp.mods.socket.io.impl.Room;
import com.nhncorp.mods.socket.io.impl.RoomClient;
import com.nhncorp.mods.socket.io.spring.DefaultEmbeddableVerticle;

public class SocketIO extends DefaultEmbeddableVerticle 
{
	private static 	SocketIOServer io = null;
	private	int		port;
	
	public int getPort() 
	{
		return port;
	}
	public void setPort(int port) 
	{
		this.port = port;
	}

	@Override
	public void start(Vertx vertx) 
	{
		// HttpServlet ��
		HttpServer server = vertx.createHttpServer();
		
		io = new DefaultSocketIOServer(vertx, server);

		System.out.println("SocketIOServer create");
		
		// Connection �̺�Ʈ ����
		
		io.sockets().onConnection(new Handler<SocketIOSocket>() {

			public void handle(final SocketIOSocket socket) 
			{
				System.out.println("Connection handling");
				// Ư�� Ű ������ ��û�� ������ �̺�Ʈ ����
				socket.on("room", new Handler<JsonObject>() {

					public void handle(JsonObject data) {
						String room = data.getString("room");
						socket.join(room);
						socket.emit("roomCreate",room);

						print(io.sockets().manager().rooms());
						print(io.sockets().clients(room));
						print(io.sockets().manager().roomClients(socket.getId()));
						// ��� Ŭ���̾�Ʈ�� �޼��� ���
						/*io.sockets().emit("response", event.getString("data"));*/
					}
				});
				socket.on("data", new Handler<JsonObject>() {
					public void handle(JsonObject data) {
						String room = data.getString("room");
						System.out.println("data-room : " + room);
						String dt = data.getString("data");
						System.out.println("data-dt : " + dt);
						io.sockets().in(room).emit("map", dt);
					}
				});
				/*socket.on("unsubscribe", new Handler<JsonObject>() {
					public void handle(JsonObject data) {
						String room = data.getString("room");
						socket.leave(room);
						socket.emit("leave:" + room);

						print(io.sockets().manager().rooms());
						print(io.sockets().clients(room));
						print(io.sockets().manager().roomClients(socket.getId()));
					}
				});*/
			}
		});
		server.listen(port);
	}

	private void print(RoomClient roomClient) {
		System.out.println("===================== RoomClient ===================");
		System.out.println(roomClient.toString());
	}

	private void print(String[] clients) {
		System.out.println("===================== Clients ===================");
		if(clients == null) {
			return;
		}
		for(String client : clients) {
			System.out.println("client : " + client);
		}
	}

	private void print(Map<String, Room> rooms) {
		System.out.println("===================== Rooms ===================");
		for(Map.Entry<String, Room> entry : rooms.entrySet()){
			System.out.println("getKey : " + entry.getKey());
			Room room  = entry.getValue();
			for(String client : room.values()) {
				System.out.println("client : " + client);
			}
		}
	}
}