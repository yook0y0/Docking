package org.docking.erbse.socket;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.docking.erbse.util.JsonParser;
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

public class SocketServer extends DefaultEmbeddableVerticle 
{
	private static SocketIOServer io = null;
	private int	port;

	public int getPort() 
	{
		return port;
	}
	public void setPort(int port) 
	{
		this.port = port;
	}
	
	public void start(){
		this.start(Vertx.newVertx());
	}

	@Override
	public void start(Vertx vertx) 
	{
		HttpServer server = vertx.createHttpServer();

		io = new DefaultSocketIOServer(vertx, server);

		io.sockets().onConnection(new Handler<SocketIOSocket>() {
			public void handle(final SocketIOSocket socket) 
			{
				socket.on("document", new Handler<JsonObject>() {
					public void handle(JsonObject data) 
					{
						String room = data.getString("document");
						socket.join(room);

						String	memberId = data.getString("memberId");
						String	initData = setInitData(room);


						if(!initData.equals("0"))
						{
							socket.emit("roomCreate",initData);
						}

						/*Attr.socketList.put(socket.getId(), memberId);*/

						String[] clients = io.sockets().clients(room);

						String[] userIdList = new String[clients.length];
						for(int i=0;i<clients.length;i++){
							/*userIdList[i] = Attr.socketList.get(clients[i]);*/
						}

						io.sockets().in(room).emit("userList", JsonParser.getInstance().jParseArr(userIdList));
						io.sockets().in(room).emit("chat_receive", JsonParser.getInstance().jParseArr(new String[]{"join",memberId," 님이 입장하셨습니다."}));

						print(io.sockets().manager().rooms());
						print(io.sockets().clients(room));
						print(io.sockets().manager().roomClients(socket.getId()));
					}
				});
				
				socket.on("chat_send", new Handler<JsonObject>() 
						{
							public void handle(JsonObject data) 
							{
								String	memberId = data.getString("memberId");
								String	message = data.getString("data");
								
								io.sockets().emit("chat_receive", JsonParser.getInstance().jParseArr(new String[]{"chat",memberId,message}));
							}
						});

				socket.on("data", new Handler<JsonObject>() 
						{
					public void handle(JsonObject data) {
						String room = data.getString("room");
						String dt = data.getString("data");
						String memberId = data.getString("memberId");

						/*if(!Attr.backUpData.equals("0"))
						{
							dt = Attr.backUpData;

							System.out.println("SocketIO comming");
						}*/

						String res =  JsonParser.getInstance().jParseObj(new String[]{"data","memberId"}, new String[]{dt,memberId});
						io.sockets().in(room).emit("map", res);
					}
						});

				socket.onDisconnect(new Handler<JsonObject>() 
						{
					public void handle(JsonObject data) 
					{
						/*String	memberId = Attr.socketList.get(socket.getId());
						
						Attr.socketList.remove(socket.getId());*/

						RoomClient rc = io.sockets().manager().roomClients(socket.getId());
						Set<String> rs = rc.rooms();

						Iterator<String>	iterator = rs.iterator();

						String	roomId = "";

						while(iterator.hasNext())
						{
							if((roomId = iterator.next()) != "")
							{
								roomId = roomId.replace("/", "");
							}
						}

						String[] clients = io.sockets().clients(roomId);


						String[] userIdList = new String[clients.length];

						/*for(int i=0;i<clients.length;i++)
						{
							userIdList[i] = Attr.socketList.get(clients[i]);
						}

						io.sockets().in(roomId).emit("userList", JsonParser.getInstance().jParseArr(userIdList));

						io.sockets().in(roomId).emit("chat_receive", JsonParser.getInstance().jParseArr(new String[]{"exit",memberId," 님이 퇴장하셨습니다."}));*/
					}
						});
			}
		});

		server.listen(port);
	}

	private String setInitData(String room)
	{
		String	docId = room;

		/*SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);*/

		/*List<TempVO>	tempList = searchAction.searchTempByDocId(docId);

		String	backUpData = "0";

		if(tempList.size() != 0)
		{
			int	lastDate = tempList.get(0).getCheckLast();

			for(TempVO vo : tempList)
			{
				if(vo.getCheckLast() >= lastDate)
				{
					lastDate = vo.getCheckLast();

					backUpData = vo.getBackUpData();
				}
			}
		}

		return backUpData;*/
		return null;
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