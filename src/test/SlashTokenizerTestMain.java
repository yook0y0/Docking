package test;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.tokenizer.SlashTokenizer;

public class SlashTokenizerTestMain 
{
	public static void main(String[] args) throws Exception 
	{
		String str = "a/b/c/d";
		
		DockingAnalyzer da = new SlashTokenizer(str);
		
		da.analyze();
		
		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);
		
		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();
		
		// type은 해당데이터 뭐인지.. token 이란 말만 들어있음	
		for(int i=0;i<type.length;i++)
		{
			System.out.println("type : " + new String(type[i]));
			System.out.println("data : " + new String(data[i]));
		}
	}
}
