package org.docking.erbse.test;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;
import org.docking.erbse.analysis.filter.DataConversionFilter;
import org.docking.erbse.analysis.filter.DataSearchFilter;
import org.docking.erbse.analysis.register.DataRegister;

public class FilterTest {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
/*		long start = System.currentTimeMillis();
*/		
		String str = "1234";
		String srcData = "2";
		String destData = "234dddddddddddddd";
		
		DockingAnalyzer da = new DataConversionFilter(new DataRegister(1234),srcData.getBytes(),destData.getBytes());
		da.analyze();
		
		DataAttribute dAttr = (DataAttribute)da.getAttrSet().get(Attr.DATA_ATTR);

/*		System.out.println(dAttr.getStringValue());*/
/*		DockingAnalyzer da = new DataSearchFilter(new DataRegister(str),srcData.getBytes());
		da.analyze();
		
		IndexAttribute iAttr = (IndexAttribute)da.getAttrSet().get(Attr.INDEX_ATTR);
		int[] start = iAttr.getStartWidth();
		int[] end = iAttr.getEndWidth();
		
		for(int i=0;i<start.length;i++){
				System.out.println("index : " + start[i] + " / " + end[i]);
		}
*//*		str = str.replace(srcData, destData);
*/		
/*		long end = System.currentTimeMillis();
		System.out.println( "실행 시간 : " + ( end - start )/1000.0 );
*/	}
}