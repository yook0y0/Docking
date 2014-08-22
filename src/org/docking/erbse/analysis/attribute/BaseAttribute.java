package org.docking.erbse.analysis.attribute;

public abstract class BaseAttribute implements Attribute{

	private int process;

	public BaseAttribute(int process) {
		super();
		this.process = process;
	}

	public int getProcess() {
		return process;
	}

	public void setProcess(int process) {
		this.process = process;
	}
}