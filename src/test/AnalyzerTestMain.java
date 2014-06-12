package test;

import analyze.DockingAnalyzer;
import analyze.analyzer.FileRscRegister;
import analyze.attribute.AttributeDataType;
import analyze.filter.FileStructureChkFilter;

public class AnalyzerTestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		
		DockingAnalyzer ds = new FileStructureChkFilter(new FileRscRegister("C:/zipTest"));
		ds.analyze();
		
		System.out.println(ds.getAttrSet().get(AttributeDataType.FILE_STRUCTURE));	
	}
}
