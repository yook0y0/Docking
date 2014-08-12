package org.docking.erbse.analysis.filter;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;
import org.docking.erbse.analysis.attribute.IndexAttribute;

public class DataSearchFilter extends Filter {

	private byte[] token;

	public DataSearchFilter(DockingAnalyzer stream) {
		this(stream,new byte[]{});
	}

	public DataSearchFilter(DockingAnalyzer stream, byte[] token){
		super(stream);
		this.token = token;
	}

	public byte[] getToken() {
		return token;
	}

	public void setToken(byte[] token) {
		this.token = token;
	}

	@Override
	public void analyze() throws Exception {
		DataAttribute dAttr = null;
		dAttr = (DataAttribute)this.getAttrSet().get(Attr.DATA_ATTR);

		IndexAttribute iAttr = new IndexAttribute();
		super.addAttr(Attr.INDEX_ATTR, iAttr);

		List<Integer> swList = new ArrayList<Integer>();
		List<Integer> ewList = new ArrayList<Integer>();

		if(dAttr != null){

			int chk = 0;

			byte[] data = dAttr.getData();

			int size = data.length;

			int datSize = data.length;
			for(int j=0;j<datSize;j++){
				if(data[j] == this.token[0]){
					for(int k=1;k<this.token.length;k++){
						if(data[j+k] != this.token[k]){
							break;
						}
						else{
							chk++;
						}
					}
					if(chk == this.token.length-1){
						swList.add(j);
						ewList.add(j+this.token.length);
						j += this.token.length;
					}
					chk = 0;
				}
			}

			int indexSize = swList.size();
			int[] startWidth = new int[indexSize];
			int[] endWidth = new int[indexSize];

			for(int j=0;j<swList.size();j++){
				startWidth[j] = swList.get(j).intValue();					
				endWidth[j] = ewList.get(j).intValue();
			}
			
			iAttr.setStartWidth(startWidth);
			iAttr.setEndWidth(endWidth);
			super.modifyAttr(Attr.INDEX_ATTR, iAttr);
		}
		else{
			// Error Message..
		}
	}
}