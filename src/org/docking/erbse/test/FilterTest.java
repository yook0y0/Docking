package org.docking.erbse.test;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.filter.processImpl.SingleDataUpdateFilter;
import org.docking.erbse.analysis.register.DataRegister;
import org.docking.erbse.file.FileManager;
import org.docking.erbse.util.GlobalVariable;

public class FilterTest 
{
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		FileManager fm = new FileManager();
		
		String str = new String(fm.read("C:\\start.html"));
		String test = "./css/.a";
/*		String[] test = {"12345@6789","98765432@"};
		byte[][] preData = {"@".getBytes(),"8".getBytes()};
		byte[][] postData = {"#".getBytes(),"9".getBytes()};
		byte[][] processData = {"###########".getBytes(),"@".getBytes()};
		*/
		byte[][] targetData = {"./".getBytes()};
		
		String prData = GlobalVariable.SERVER_ADDRESS + "getEditorCode?editorId=" + "1" + "&path=";
		byte[][] processData = {prData.getBytes()};
		DockingAnalyzer da = new SingleDataUpdateFilter(new DataRegister(str),targetData,processData);
/*		DockingAnalyzer da = new MedianDataUpdateFilter(new DataRegister(str),preData,postData,processData);*/
/*		DockingAnalyzer da = new DockingPathConversionFilter(new DataRegister(test));
*/
		da.analyze();
		
		DataAttribute dAttr = (DataAttribute)da.getAttrSet().get(Attr.DATA_ATTR);
/*		IndexAttribute iAttr = (IndexAttribute)da.getAttrSet().get(Attr.INDEX_ATTR);
		TokenAttribute tAttr = (TokenAttribute)da.getAttrSet().get(Attr.TOKEN_ATTR);
*/
		String[] sArray = dAttr.getStringValue();
		System.out.println("sArray size : " + sArray.length);
/*		int[][] startArr = iAttr.getStartWidth();
		int[][] endArr = iAttr.getEndWidth();
*//*
		byte[][][] tData = tAttr.getData();*/
		
		for(int i=0;i<sArray.length;i++){
			System.out.println("sArr " + "[ " + i + " ] : " + sArray[i]);
		}
		/*for(int i=0;i<startArr.length;i++){
			for(int j=0;j<startArr[i].length;j++){
				System.out.println("startArr " + "[ " + i + " ] : " + startArr[i][j]);
				System.out.println("endArr " + "[ " + i + " ] : " + endArr[i][j]);
			}
		}*/
/*		for(int i=0;i<tData.length;i++){
			for(int j=0;j<tData[i].length;j++){
				System.out.println("tData : " + new String(tData[i][j]));
			}
		}*/
	}
}
