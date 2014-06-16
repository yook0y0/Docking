package test;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.tokenizer.StringTokenizer;

public class TokenizerTestMain {

	public static void main(String[] args) throws Exception
	{
		long before = System.currentTimeMillis();
		System.out.println(before);
		
		String test = "t4tttttt aat5ewaaa b cct1ewcc dte6wd";
		DockingAnalyzer da = new StringTokenizer(test,new String[]{"tt"});
		
		da.analyze();
		DataAttribute dAttr = (DataAttribute) da.getAttrSet().get(Attr.ATTRSET_FILE_DATA);
		
		byte[][] type = dAttr.getType();
		byte[][] data = dAttr.getData();
		
		/*for(int i=0;i<type.length;i++){
			System.out.print("type : ");
			for(byte t : type[i]){
				System.out.print(t + " ");
			}
			System.out.println();
			System.out.print("data : ");
			for(byte t : data[i]){
				System.out.print(t + " ");
			}
			System.out.println();
		}*/
		
		for(int i=0;i<type.length;i++){
			System.out.println("type : " + new String(type[i]));
			System.out.println("data : " + new String(data[i]));
		}
		
		long after = System.currentTimeMillis();
		System.out.println(before);
		long processingTime = after - before;
		System.out.println("res : " + processingTime);
	}
}