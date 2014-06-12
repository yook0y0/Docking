package analyze.attribute;

import java.util.HashMap;
import java.util.Map;

import analyze.DockingAnalyzer;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public abstract class DockingAttrSet implements DockingAnalyzer{

	private Map<Integer, String> attrSet;

	public DockingAttrSet() {
		this.attrSet = new HashMap<Integer, String>();
	}

	public DockingAttrSet(Map<Integer, String> attrSet) {
		super();
		this.attrSet = attrSet;
	}

	public Map<Integer, String> getAttrSet() {
		return attrSet;
	}

	public void setAttrSet(Map<Integer, String> attrSet) {
		this.attrSet = attrSet;
	}

	public void addAttr(Integer key, String attr) throws Exception {

		if(attrSet.put(key, attr) == null) {
			throw new Exception();
		}
	}

	public String getAttr(Integer key) throws Exception {

		String attr = attrSet.get(key);
		if(attr == null) {
			throw new Exception();
		}
		return attr;
	}

	public void removeAttr(Integer key) throws Exception {

		if(attrSet.remove(key) == null) {
			throw new Exception();
		}
	}

	public void modifyAttr(Integer key, String attr) throws Exception {

		String tmp = attrSet.get(key);

		if(tmp == null) {
			throw new Exception();
		}

		tmp = attr;
	}
	
	public String jParseArr(String[] str) {

		JSONArray jArr = new JSONArray();

		for (int i = 0; i < str.length; i++) {
			jArr.add(str[i]);
		}

		return jArr.toString();
	}

	public String jParseObj(String[] key, String[] val) {
		JSONObject jObj = new JSONObject();

		for (int i = 0; i < val.length; i++) {
			jObj.put(key[i], val[i]);
		}

		return jObj.toString();
	}
}