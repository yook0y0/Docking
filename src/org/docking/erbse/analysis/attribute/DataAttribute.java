package org.docking.erbse.analysis.attribute;

import java.util.Arrays;

public class DataAttribute extends BaseAttribute {

	private byte[] data;
	
	public DataAttribute() {
		super(Attr.DATA_ATTR);
		this.data = null;
	}

	public byte[] getData() {
		return data;
	}
	
	public void setData(byte data) {
		this.setData(new byte[]{data});
	}

	public void setData(byte[] data) {
		this.data = data;
	}
	
	public void setData(Number data) {
		this.setData(data.byteValue());
	}
	
	public void setData(Number[] data) {
		byte[] bArr = new byte[data.length];
		for(int i=0;i<bArr.length;i++){
			bArr[i] = data[i].byteValue();
		}
		this.setData(bArr);
	}
	
	public void setData(char[] data) {
		byte[] bArr = new byte[data.length];
		for(int i=0;i<bArr.length;i++){
			bArr[i] = (byte)data[i];
		}
		this.setData(bArr);
	}
	
	public void setData(String data) {
		this.setData(data.getBytes());
	}
	
	public String getStringValue(){
		return new String(data);
	}
	
	public boolean clear() {
		// TODO Auto-generated method stub
		super.setProcess(Attr.ORIGINAL_DATA);
		this.data = null;
		if(this.data != null)
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(data);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		DataAttribute other = (DataAttribute) obj;
		if (!Arrays.equals(data, other.data))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "DataAttribute [data=" + Arrays.toString(data) + "]";
	}
}