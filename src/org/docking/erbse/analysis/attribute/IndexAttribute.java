package org.docking.erbse.analysis.attribute;

import java.util.Arrays;

public class IndexAttribute extends BaseAttribute {

	private int[] startWidth;
	private int[] endWidth;
	
	public IndexAttribute(){
		super(Attr.ORIGINAL_DATA);
		this.startWidth = null;
		this.endWidth = null;
	}

	public int[] getStartWidth() {
		return startWidth;
	}

	public void setStartWidth(int[] startWidth) {
		this.startWidth = startWidth;
	}

	public int[] getEndWidth() {
		return endWidth;
	}

	public void setEndWidth(int[] endWidth) {
		this.endWidth = endWidth;
	}

	@Override
	public boolean clear() {
		// TODO Auto-generated method stub
		super.setProcess(Attr.ORIGINAL_DATA);
		this.startWidth = null;
		this.endWidth = null;
		if(this.startWidth != null || this.endWidth != null){
			return false;
		}
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(endWidth);
		result = prime * result + Arrays.hashCode(startWidth);
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
		IndexAttribute other = (IndexAttribute) obj;
		if (!Arrays.equals(endWidth, other.endWidth))
			return false;
		if (!Arrays.equals(startWidth, other.startWidth))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "IndexAttribute [startWidth=" + Arrays.toString(startWidth)
				+ ", endWidth=" + Arrays.toString(endWidth) + "]";
	}
}