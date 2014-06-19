package test;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.servlet.ServletOutputStream;

import org.vertx.java.core.Vertx;

import socketIO.SocketIO;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileReaderFilter;
import analysis.filter.FileUnzipFilter;
import analysis.register.FilePathRegister;

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
