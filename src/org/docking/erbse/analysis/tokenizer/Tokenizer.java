package org.docking.erbse.analysis.tokenizer;

import org.docking.erbse.analysis.DockingStream;
import org.docking.erbse.analysis.attribute.AttributeSource;


public abstract class Tokenizer extends AttributeSource{

	private DockingStream stream;
	private byte[] token;

	public Tokenizer(DockingStream stream, byte[] token) {
		this.stream = stream;
		this.token = token;
		super.setAttrSet(this.stream.getAttrSet());
		stream.analyze();
	}

	public DockingStream getStream() {
		return this.stream;
	}
	
	public void setStream(DockingStream stream) {
		this.stream = stream;
	}
	
	public byte[] getToken() {
		return this.token;
	}
	
	public void setToken(byte[] token){
		this.token = token;
	}
}