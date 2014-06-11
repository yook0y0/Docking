package test;

import analyze.DockingStream;
import analyze.analyzer.FileRscPathAnalyzer;
import analyze.attribute.AttributeDataType;
import analyze.filter.FileStructureChkFilter;

public class AnalyzerTestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		
		DockingStream ds = new FileStructureChkFilter(new FileRscPathAnalyzer("C:/zipTest"));
		ds.analyze();
		
		System.out.println(ds.getAttrSet().get(AttributeDataType.FILE_STRUCTURE));	
	}
}
