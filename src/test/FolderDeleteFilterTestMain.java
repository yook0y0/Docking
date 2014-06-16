package test;

import analysis.DockingAnalyzer;
import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;
import analysis.filter.FileDeleteFilter;
import analysis.filter.DirClearFilter;
import analysis.filter.FileUnzipFilter;
import analysis.register.FilePathRegister;

public class FolderDeleteFilterTestMain {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub

		String addr = "C:\\play_yobi\\yobi\\project\\2014\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp0\\wtpwebapps\\Docking\\tmp\\WebContent";
		
		long before = System.currentTimeMillis();
		System.out.println(before);
		
		DockingAnalyzer ds = new FileDeleteFilter(new FilePathRegister(addr));
		ds.analyze();
		
		long after = System.currentTimeMillis();
		System.out.println(before);
		long processingTime = after - before;
		System.out.println("res : " + processingTime);
	}

}
