package org.docking.erbse.analysis.filter;

import java.util.HashMap;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.Attribute;
import org.docking.erbse.analysis.attribute.AttributeSource;


public abstract class Filter extends AttributeSource{

	private DockingAnalyzer stream;

	public Filter(DockingAnalyzer stream) {
		super(new HashMap<Integer,Attribute>());
		this.stream = stream;
		try {
			stream.analyze();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public DockingAnalyzer getStream() {
		return stream;
	}

	public void setStream(DockingAnalyzer stream) {
		this.stream = stream;
	}
}
