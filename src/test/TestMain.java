package test;

import org.vertx.java.core.Vertx;

import socketIO.SocketIO;

public class TestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		SocketIO io = new SocketIO();
		
		io.setPort(9000);
		io.start(Vertx.newVertx());
	}
}
