package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingStream;
import org.docking.erbse.analysis.attribute.AttributeSource;


public abstract class Filter extends AttributeSource{

	private DockingStream stream;

	public Filter(DockingStream stream) {
		this.stream = stream;
		super.setAttrSet(this.stream.getAttrSet());
		stream.analyze();
	}

	public DockingStream getStream() {
		return stream;
	}
	public void setStream(DockingStream stream) {
		this.stream = stream;
	}
}