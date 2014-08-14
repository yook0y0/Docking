package org.docking.erbse.analysis.attribute;

import java.util.Arrays;

public class TokenAttribute extends BaseAttribute {

	private byte[][][] data;
	
	public TokenAttribute() {
		super(Attr.TOKEN_ATTR);
		this.data = null;
		// TODO Auto-generated constructor stub
	}
	
	public void setData(byte[][][] data){
		this.data = data;
	}
	
	public byte[][][] getData(){
		return this.data;
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
		TokenAttribute other = (TokenAttribute) obj;
		if (!Arrays.deepEquals(data, other.data))
			return false;
		return true;
	}

	@Override
	public boolean clear() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String toString() {
		return "TokenAttribute [data=" + Arrays.toString(data) + "]";
	}
}
