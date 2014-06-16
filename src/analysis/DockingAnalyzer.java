package analysis;

import java.util.Map;

import analysis.attribute.Attribute;

public interface DockingAnalyzer {

	public Map<Integer, Attribute> getAttrSet();
	public void setAttrSet(Map<Integer,Attribute> attrSet);
	
	public void analyze() throws Exception;
}