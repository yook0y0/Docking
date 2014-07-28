package kr.co.docking.analysis.attribute;

import java.util.HashMap;
import java.util.Map;

import kr.co.docking.analysis.analysis.DockingAnalyzer;

@SuppressWarnings("rawtypes")
public abstract class AttributeSource implements DockingAnalyzer{

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
		
		try {
			this.addAttr(type, attr);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return attr;
	}

	public Map<Integer, Attribute> getAttrSet() {
		return attrSet;
	}

	public void setAttrSet(Map<Integer, Attribute> attrSet) {
		this.attrSet = attrSet;
	}

	public void addAttr(Integer type, Attribute attr) throws Exception {
		this.attrSet.put(type, attr);
	}

	public Attribute getAttr(Integer type) throws Exception {

		Attribute attr = attrSet.get(type);
		if(attr == null) {
			throw new Exception();
		}
		return attr;
	}

	public void removeAttr(Integer type) throws Exception {

		if(attrSet.remove(type) == null) {
			throw new Exception();
		}
	}

	public void modifyAttr(Integer type, Attribute attr) throws Exception {

		Attribute tmp = attrSet.get(type);

		if(tmp == null) {
			throw new Exception();
		}
		tmp = attr;
	}
}