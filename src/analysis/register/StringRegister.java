package analysis.register;

import analysis.attribute.Attr;
import analysis.attribute.DataAttribute;

public class StringRegister extends Register {

	private String str;
	
	public StringRegister(String str) {
		this.str = str;
	}
	
	public String getString() {
		return str;
	}
	
	public void setString(String str) {
		this.str = str;
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		
		DataAttribute da = (DataAttribute) this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);
		
		byte[][] type = new byte[1][];
		byte[][] data = new byte[1][];
		
		type[0] = this.str.getBytes();
		data[0] = this.str.getBytes();
		
		da.setProcess(Attr.PROCESS_REGISTER);
		da.setType(type);
		da.setData(data);
		
		this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, da);
	}
}
