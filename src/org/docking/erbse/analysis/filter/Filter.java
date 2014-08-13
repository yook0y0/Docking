package org.docking.erbse.analysis.filter;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.AttributeSource;


public abstract class Filter extends AttributeSource{

	private DockingAnalyzer stream;

	public Filter(DockingAnalyzer stream) {
		this.stream = stream;
		super.setAttrSet(this.stream.getAttrSet());
		stream.analyze();
	}

	public DockingAnalyzer getStream() {
		return stream;
	}
	public void setStream(DockingAnalyzer stream) {
		this.stream = stream;
	}
}