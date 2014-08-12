package org.docking.erbse.analysis.filter;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;


public class FileReaderFilter extends Filter {

	public FileReaderFilter(DockingAnalyzer da) {
		super(da);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void analyze() throws Exception {
		
		DataAttribute dAttr = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){
			
			dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);
			
			if(dAttr.getProcess() == Attr.PROCESS_REGISTER){
				
				String getData = new String(dAttr.getData()[0]);
				
				File[] files = this.fileStructureChk(new File(getData));
				int size = files.length;
				
				byte[][] type = new byte[size][];
				byte[][] data = new byte[size][];
				
				for(int i=0;i<size;i++){
					type[i] = files[i].getName().getBytes();
					data[i] = this.getBytesFromFile(files[i]);
				}
				
				dAttr.setProcess(Attr.PROCESS_FILTER);
				dAttr.setType(type);
				dAttr.setData(data);
				
				this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
			}
			else {
				// Error Message..
			}
		}
		else{
			// Error Message..
		}	
	}

	private File[] fileStructureChk(File file) throws IOException {

		List<File> list = new ArrayList<File>();

		if (file.isDirectory()) {   
			if (file.listFiles().length != 0) {
				File[] fileList = file.listFiles();
				for (int i = 0; i < fileList.length; i++) {
					fileStructureChk(fileList[i]);

					list.add(fileList[i]);
				}
			}
			else {
				list.add(file);
			}
		} else {
			list.add(file);
		}
		File[] files = new File[list.size()];
		list.toArray(files);

		return files;
	}

	@SuppressWarnings("resource")
	private byte[] getBytesFromFile(File file) throws IOException {

		InputStream is = new FileInputStream(file);

		long length = file.length();

		if(length > Integer.MAX_VALUE) {
			// Error message..
		}

		byte[] bytes = new byte[(int) length];

		int offset = 0;
		int numRead = 0;

		while(offset < bytes.length && (numRead = is.read(bytes, offset, bytes.length - offset)) >= 0) { 
			offset += numRead;
		}

		if(offset < bytes.length) {
			throw new IOException("IOException : " + file.getName());
		}
		is.close();

		return bytes;
	}
}