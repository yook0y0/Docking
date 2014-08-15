package org.docking.erbse.test;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;
import org.docking.erbse.analysis.attribute.TokenAttribute;
import org.docking.erbse.analysis.register.DataRegister;
import org.docking.erbse.analysis.tokenizer.DataTokenizer;

public class FilterTest 
{
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		String test = "123456789";
		byte[] src = "3456".getBytes();
		byte[][] appendSrc = {"7".getBytes(),"9".getBytes()};
		byte[][] chkSrc = {"###".getBytes(),"@".getBytes()};
		DockingAnalyzer da = new DataTokenizer(new DataRegister(test),src);
		da.analyze();
		
		DataAttribute dAttr = (DataAttribute)da.getAttrSet().get(Attr.DATA_ATTR);
		IndexAttribute iAttr = (IndexAttribute)da.getAttrSet().get(Attr.INDEX_ATTR);
		TokenAttribute tAttr = (TokenAttribute)da.getAttrSet().get(Attr.TOKEN_ATTR);

		String[] sArray = dAttr.getStringValue();
		int[][] startArr = iAttr.getStartWidth();
		int[][] endArr = iAttr.getEndWidth();

		byte[][][] tData = tAttr.getData();
		
		for(int i=0;i<sArray.length;i++){
			System.out.println("sArr " + "[ " + i + " ] : " + sArray[i]);
		}
		for(int i=0;i<startArr.length;i++){
			for(int j=0;j<startArr[i].length;j++){
				System.out.println("startArr " + "[ " + i + " ] : " + startArr[i][j]);
				System.out.println("endArr " + "[ " + i + " ] : " + endArr[i][j]);
			}
		}
		for(int i=0;i<tData.length;i++){
			for(int j=0;j<tData[i].length;j++){
				System.out.println("tData : " + new String(tData[i][j]));
			}
		}
	}
}
