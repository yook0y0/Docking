package org.docking.erbse.util;

import org.docking.erbse.controller.DocumentController;
import org.docking.erbse.controller.EditorController;
import org.docking.erbse.controller.MemberController;
import org.docking.erbse.controller.ReviewController;

public class Injector
{
	private static Injector instance;
	static
	{
		instance = new Injector();
	}
	
	private Injector(){
		
	}
	
	public static Injector getInstance()
	{
		return instance;
	}
	
	@SuppressWarnings("rawtypes")
	public Object getObject(Class type)
	{
		/*
		 * Controller
		 */
		if(type == DocumentController.class)
		{
			return createDocumentController();
		}
		else if(type == EditorController.class)
		{
			return createEditorController();
		}
		else if(type == MemberController.class)
		{
			return createMemberController();
		}
		else if(type == ReviewController.class)
		{
			return createEditorReviewController();
		}
		return null;
	}
	
	private Object createEditorReviewController(){
		return new ReviewController();
	}

	private Object createMemberController() {
		// TODO Auto-generated method stub
		return new MemberController();
	}

	private Object createEditorController() {
		// TODO Auto-generated method stub
		return new EditorController();
	}

	private Object createDocumentController() {
		// TODO Auto-generated method stub
		return new DocumentController();
	}
}
