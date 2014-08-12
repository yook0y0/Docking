package org.docking.erbse.analysis.register;

import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;


public class FilePathRegister extends Register 
{
	private String path;
	
	public FilePathRegister(String path) {
		this.path = path;
	}
	
	public String getPath() {
		return path;
	}
	
	public void setPath(String path) {
		this.path = path;
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		
		DataAttribute da = (DataAttribute) this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);
		
		byte[][] type = new byte[1][];
		byte[][] data = new byte[1][];
		
		type[0] = this.path.getBytes();
		data[0] = this.path.getBytes();
		
		da.setProcess(Attr.PROCESS_REGISTER);
		da.setType(type);
		da.setData(data);
		
		this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, da);
	}
}
