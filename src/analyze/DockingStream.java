package analyze;

import java.util.Map;

public interface DockingStream {

	public Map<Integer,String> getAttrSet();
	public void setAttrSet(Map<Integer,String> attrSet);

	public void analyze() throws Exception;
}