package org.docking.erbse.analysis.tokenizer;

import org.docking.erbse.analysis.DockingAnalyzer;
import org.docking.erbse.analysis.attribute.AttributeSource;


public abstract class Tokenizer extends AttributeSource{

	private DockingAnalyzer stream;
	private byte[] token;

	public Tokenizer(DockingAnalyzer stream, byte[] token) {
		this.stream = stream;
		this.token = token;
		super.setAttrSet(this.stream.getAttrSet());
		stream.analyze();
	}

	public DockingAnalyzer getStream() {
		return this.stream;
	}
	
	public void setStream(DockingAnalyzer stream) {
		this.stream = stream;
	}
	
	public byte[] getToken() {
		return this.token;
	}
	
	public void setToken(byte[] token){
		this.token = token;
	}
}