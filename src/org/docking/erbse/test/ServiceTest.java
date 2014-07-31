package org.docking.erbse.test;

import org.docking.erbse.service.DocumentService;
import org.docking.erbse.service.DocumentServiceImpl;



public class ServiceTest {

	/**
	 * @param args
	 * @throws SecurityException 
	 * @throws NoSuchFieldException 
	 */
	public static void main(String[] args) throws NoSuchFieldException, SecurityException {
		// TODO Auto-generated method stub

		
		DocumentService ds = new DocumentServiceImpl();
		
		String res = ds.joinDocumentList("id1");
		System.out.println("res : " + res);
	}
}
