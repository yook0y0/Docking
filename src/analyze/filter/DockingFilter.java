package analyze.filter;

import java.util.HashMap;

import analyze.DockingStream;
import analyze.attribute.DockingAttrSet;

public abstract class DockingFilter extends DockingAttrSet{

	private DockingStream stream;

	public DockingFilter(DockingStream stream) {
		super(new HashMap<Integer,String>());
		this.stream = stream;
	}

	public DockingStream getStream() {
		return stream;
	}

	public void setStream(DockingStream stream) {
		this.stream = stream;
	}
}
