package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.DataAttribute;

public class DataConversionFilter extends Filter {

	private byte[] srcData;
	private byte[] destData;

	public DataConversionFilter(DockingAnalyzer stream) {
		this(stream,new byte[]{},new byte[]{});
	}

	public DataConversionFilter(DockingAnalyzer stream, byte[] srcData, byte[] destData){
		super(stream);
		this.srcData = srcData;
		this.destData = destData;
	}

	public byte[] getSrcData() {
		return srcData;
	}

	public void setSrcData(byte[] srcData) {
		this.srcData = srcData;
	}

	public byte[] getDestData() {
		return destData;
	}

	public void setDestData(byte[] destData) {
		this.destData = destData;
	}

	@Override
	public void analyze() throws Exception {
		DataAttribute dAttr = null;
		dAttr = (DataAttribute)this.getAttrSet().get(Attr.DATA_ATTR);
		if(dAttr != null){			
			byte[][] data = dAttr.getData();
			
			for(int i=0;i<data.length;i++){
				data[i] = this.replace(data[i]);
			}

			dAttr.setProcess(Attr.PROCESS_FILTER);
			super.modifyAttr(Attr.DATA_ATTR, dAttr);
		}
		else{
			// Error Message..
		}
	}
	
	private byte[] replace(byte[] data){
		int chk = 0;

		byte[] bArr = null;
		
		for(int i=0;i<data.length;i++){
			if(data[i] == this.srcData[0]){
				for(int j=1;j<this.srcData.length;j++){
					if(data[i+j] != this.srcData[j]){
						break;
					}
					else{
						chk++;
					}
				}
				if(chk == this.srcData.length-1){
					
						bArr = new byte[data.length-this.srcData.length+this.destData.length];
					
						System.arraycopy(data, 0, bArr, 0, i);
						System.arraycopy(this.destData, 0, bArr, i, this.destData.length);
						System.arraycopy(data, i+this.srcData.length, bArr, i+this.destData.length, data.length-(i+this.srcData.length));
						
						i += this.srcData.length;
				}
				chk = 0;
			}
		}
		return bArr;
	}
}