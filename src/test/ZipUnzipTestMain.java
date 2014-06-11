package test;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import io.DockingZip;

public class ZipUnzipTestMain {

	/**
	 * @param args
	 * @throws IOException 
	 * @throws FileNotFoundException 
	 */
	public static void main(String[] args) throws FileNotFoundException, IOException {
		// TODO Auto-generated method stub

		DockingZip dz = new DockingZip();
		
		File zipFile = new File("C:/zipTest");
		dz.zip(zipFile);
		
		File unzipFile = new File("C:/zipTest.zip");
		dz.unZip(unzipFile);
	}

}
