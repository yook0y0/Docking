package org.docking.erbse.analysis.attribute;

import java.util.HashMap;
import java.util.Map;

import org.docking.erbse.analysis.DockingStream;


@SuppressWarnings("rawtypes")
public abstract class AttributeSource implements DockingStream{

	private Map<Integer, Attribute> attrSet;
	
	public AttributeSource() {
		this.attrSet = new HashMap<Integer, Attribute>();
	}

	public AttributeSource(Map<Integer, Attribute> attrSet) {
		super();
		this.attrSet = attrSet;
	}
	
	public Attribute addAttribute(Integer type, Class name) throws InstantiationException, IllegalAccessException
	{
		Object obj = name.newInstance();
		
		Attribute attr = (Attribute)obj;
		
		this.addAttr(type, attr);
		
		return attr;
	}

	public Map<Integer, Attribute> getAttrSet() {
		return attrSet;
	}

	public void setAttrSet(Map<Integer, Attribute> attrSet) {
		this.attrSet = attrSet;
	}

	public void addAttr(Integer type, Attribute attr) {
		this.attrSet.put(type, attr);
	}

	public Attribute getAttr(Integer type) {

		Attribute attr = attrSet.get(type);
		if(attr == null) {
			return null;
		}
		return attr;
	}

	public Attribute removeAttr(Integer type) {
		Attribute attr = attrSet.get(type);
		if(attrSet.remove(type) == null) {
			return null;
		}
		return attr;
	}

	public Attribute modifyAttr(Integer type, Attribute attr) {

		Attribute tmp = attrSet.get(type);

		if(tmp == null) {
			return null;
		}

		attrSet.remove(type);
		attrSet.put(type, tmp);
		return tmp;
	}
}