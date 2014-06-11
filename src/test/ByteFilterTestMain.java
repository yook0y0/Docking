package test;

import analyze.DockingStream;
import analyze.analyzer.FileRscPathAnalyzer;
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

		DockingStream ds = new FileToBytesFilter(new FileRscPathAnalyzer("C:/zipTest/test.png"));
		
		ds.analyze();

		System.out.println(ds.getAttrSet().get(AttributeDataType.FILE_BYTE_DATA));
	}
}
