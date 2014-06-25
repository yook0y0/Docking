package test;

import analysis.DockingAnalyzer;
import analysis.filter.FileUnzipFilter;
import analysis.filter.FileWriterFilter;
import analysis.register.FilePathRegister;

public class FileWriterFilterTestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		DockingAnalyzer da = new FileWriterFilter(new FileUnzipFilter(new FilePathRegister("C:\\test\\okm.zip")),"C:\\test\\tmp");
		da.analyze();
	}

}
