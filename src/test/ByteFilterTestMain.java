package test;

import analyze.DockingAnalyzer;
import analyze.analyzer.FileRscRegister;
import analyze.attribute.AttributeDataType;
import analyze.filter.FileStructureChkFilter;
import analyze.filter.FileToBytesFilter;

public class ByteFilterTestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		DockingAnalyzer ds = new FileToBytesFilter(new FileRscRegister("C:/zipTest/test.png"));
		
		ds.analyze();

		System.out.println(ds.getAttrSet().get(AttributeDataType.FILE_BYTE_DATA));
	}
}
