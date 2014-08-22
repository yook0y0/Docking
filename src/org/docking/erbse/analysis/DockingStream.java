package org.docking.erbse.analysis;

import java.util.Map;

import org.docking.erbse.analysis.attribute.Attribute;

public interface DockingStream {

	public Map<Integer, Attribute> getAttrSet();
	public void setAttrSet(Map<Integer,Attribute> attrSet);
	
	public Map<Integer, Attribute> analyze();
}