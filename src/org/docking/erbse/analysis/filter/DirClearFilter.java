package org.docking.erbse.analysis.filter;

import java.io.File;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;


public class DirClearFilter extends Filter 
{
	public DirClearFilter(DockingAnalyzer stream)
	{
		super(stream);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		DataAttribute dAttr = null;

		String getData = null;

		dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		if(dAttr != null){
			
			if(dAttr.getProcess() == Attr.PROCESS_REGISTER){
				getData = new String(dAttr.getData()[0]);

				File tmpDir = null;
				File tmpFile = null;
				File[] tmpFiles = null;

				try {
					System.out.println("getData : " + getData);
					tmpDir = new File(getData);

					if(tmpDir != null && tmpDir.exists()) {
						tmpFiles = tmpDir.listFiles();

						if(tmpFiles != null) {

							for(int i=0; i < tmpFiles.length; i++) {

								tmpFile = new File(getData + "/" + tmpFiles[i].getName());
								if(!tmpFile.isDirectory()) tmpFile.delete();
							}
						}
					}
				}
				catch(Exception e){
					e.printStackTrace();
				}
				finally {
					tmpDir = null;
					tmpFile = null;
					tmpFiles = null;
				}
			}
			else {
				// Error Message..
			}
		}
		else{
			// Error Message..
		}
	}
}
