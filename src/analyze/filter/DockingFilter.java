package analyze.filter;

import java.util.HashMap;

import analyze.DockingAnalyzer;
import analyze.attribute.DockingAttrSet;

public abstract class DockingFilter extends DockingAttrSet{

	private DockingAnalyzer stream;

	public DockingFilter(DockingAnalyzer stream) {
		super(new HashMap<Integer,String>());
		this.stream = stream;
	}

	public DockingAnalyzer getStream() {
		return stream;
	}

	public void setStream(DockingAnalyzer stream) {
		this.stream = stream;
	}
}
