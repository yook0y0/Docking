package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;



public class TokenDivisionFilter extends Filter {
	
	private String[] token;

	public TokenDivisionFilter(DockingAnalyzer stream) {
		this(stream,new String[]{""});
		// TODO Auto-generated constructor stub
	}
	
	public TokenDivisionFilter(DockingAnalyzer stream,String[] token){
		super(stream);
		this.token = token;
	}
	
	public String[] getToken() {
		return token;
	}

	public void setToken(String[] token) {
		this.token = token;
	}

	@Override
	public void analyze() throws Exception {
		// TODO Auto-generated method stub
		
		DataAttribute dAttr = null;

		dAttr = (DataAttribute)this.addAttribute(Attr.ATTRSET_FILE_DATA, DataAttribute.class);

		if(dAttr != null){

			dAttr = (DataAttribute)this.getStream().getAttrSet().get(Attr.ATTRSET_FILE_DATA);
			
			byte[][] type = dAttr.getType();
			byte[][] data = dAttr.getData();
			
			int size = type.length;
			String[] typeTmp = new String[size];
			String[] dataTmp = new String[size];
			
			for(int i=0;i<size;i++){
				typeTmp[i] = new String(type[i]);
			}
			
			int len = 0;
			for(int i=0;i<size;i++){
				for(int j=0;j<token.length;j++){
					len = typeTmp[i].lastIndexOf(token[j]);

					if(len > 0){
						dataTmp[i] = typeTmp[i].substring(len+1,typeTmp[i].length());
						break;
					}
					else{
						dataTmp[i] = "NULL";
					}
				}
			}
			
			for(int i=0;i<size;i++){
				data[i] = typeTmp[i].getBytes();
				type[i] = dataTmp[i].getBytes();
			}
			
			dAttr.setType(type);
			dAttr.setData(data);
			this.getAttrSet().put(Attr.ATTRSET_FILE_DATA, dAttr);
		}
		else{
			// Error Message..
		}
	}
}
