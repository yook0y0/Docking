package org.docking.erbse.analysis.register;

import org.docking.erbse.analysis.attribute.Attr;
import org.docking.erbse.analysis.attribute.AttributeSource;
import org.docking.erbse.analysis.attribute.DataAttribute;

public class DataRegister extends AttributeSource
{
	public DataAttribute data;
	
	public DataRegister(){
		this.data = new DataAttribute();
	}
	
	public DataRegister(DataAttribute data){
		this.data = data;
	}
	
	public DataRegister(Number data){
		this();
		this.data.setData(data);
	}
	
	public DataRegister(Number[] data){
		this();
		this.data.setData(data);
	}
	
	public DataRegister(char[] data){
		this();
		this.data.setData(data);
	}
	
	public DataRegister(String data){
		this();
		this.data.setData(data);
	}

	public DataAttribute getData() {
		return data;
	}

	public void setData(DataAttribute data) {
		this.data = data;
		this.analyze();
	}
	
	public void setData(Number data) {
		this.data.setData(data);
	}
	
	public void setData(Number[] data) {
		this.data.setData(data);
	}
	
	public void setData(char[] data) {
		this.data.setData(data);
	}
	
	public void setData(String data) {
		this.data.setData(data);
	}
	
	public void analyze(){
		super.addAttr(Attr.DATA_ATTR, data);
	}

	@Override
	public String toString() {
		return "DataRegister [data=" + data + ", getData()=" + getData()
				+ ", getAttrSet()=" + getAttrSet() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((data == null) ? 0 : data.hashCode());
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
		DataRegister other = (DataRegister) obj;
		if (data == null) {
			if (other.data != null)
				return false;
		} else if (!data.equals(other.data))
			return false;
		return true;
	}
}