package org.docking.erbse.analysis.filter;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;


public class FileWriterFilter extends Filter {

	private String destPath;

	public FileWriterFilter(DockingAnalyzer stream) {
		this(stream,"C:\\");
		// TODO Auto-generated constructor stub
	}

	public FileWriterFilter(DockingAnalyzer stream, String destPath) {
		super(stream);
		this.destPath = destPath;
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		DataAttribute dAttr = null;

		byte[] bytefName = null;
		byte[] bytefData = null;

		File newFile = null;

		dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);

		if(dAttr != null){

			for(int i=0;i<dAttr.getType().length;i++){
				bytefName = dAttr.getType()[i];
				bytefData = dAttr.getData()[i];

				BufferedOutputStream bos = null;

				newFile = new File(destPath, new String(bytefName));

				mkParentDir(newFile);
				newFile.createNewFile();

				bos = new BufferedOutputStream(new FileOutputStream(newFile));
				for(int j=0;j<bytefData.length;j++){
					bos.write(bytefData[j]);
				}
				bos.close();
			}
		}
		else{
			// Error Message..
		}
	}

	private void mkParentDir(File file) {
		File parentDir = file;
		int prnDirCnt = parentDir.getParent().split("\\\\").length;
		File[] prnDir = new File[prnDirCnt];

		for(int i=0;i<prnDirCnt;i++)
		{
			prnDir[i] = parentDir.getParentFile();
			parentDir = parentDir.getParentFile();
		}

		for(int i=prnDirCnt-1;i>=0;i--)
		{
			// Î£®Ìä∏ ?¥Îçî Íµ¨Ìïò?îÍ±∞ Ï∂îÍ??¥ÎèÑ ?†ÎìØ
			if(prnDir[i].getParent() != null){
				prnDir[i].mkdir();
			}
		}
	}
}
