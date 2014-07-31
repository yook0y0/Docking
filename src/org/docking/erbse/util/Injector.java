package org.docking.erbse.util;

import org.docking.erbse.controller.DockingController;
import org.docking.erbse.controller.DocumentController;
import org.docking.erbse.controller.EditorController;
import org.docking.erbse.controller.MemberController;
import org.docking.erbse.controller.ReviewController;
import org.docking.erbse.service.DockingService;
import org.docking.erbse.service.DockingServiceImpl;
import org.docking.erbse.service.DocumentService;
import org.docking.erbse.service.DocumentServiceImpl;
import org.docking.erbse.service.EditorService;
import org.docking.erbse.service.EditorServiceImpl;
import org.docking.erbse.service.MemberService;
import org.docking.erbse.service.MemberServiceImpl;
import org.docking.erbse.service.ReviewService;
import org.docking.erbse.service.ReviewServiceImpl;

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
		if(type == DockingController.class){
			return createDockingController();
		}
		if(type == DocumentController.class){
			return createDocumentController();
		}
		else if(type == EditorController.class){
			return createEditorController();
		}
		else if(type == MemberController.class){
			return createMemberController();
		}
		else if(type == ReviewController.class){
			return createEditorReviewController();
		}
		/*
		 * Service
		 */
		else if(type == DockingService.class){
			return createDockingService();
		}
		else if(type == DocumentService.class){
			return createDocumentService();
		}
		else if(type == EditorService.class){
			return createEditorService();
		}
		else if(type == MemberService.class){
			return createMemberService();
		}
		else if(type == ReviewService.class){
			return createReviewService();
		}
		return null;
	}
	
	private Object createDockingController(){
		return new DockingController();
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
	
	private Object createDockingService() {
		// TODO Auto-generated method stub
		return new DockingServiceImpl();
	}
	private Object createDocumentService() {
		// TODO Auto-generated method stub
		return new DocumentServiceImpl();
	}
	private Object createEditorService() {
		// TODO Auto-generated method stub
		return new EditorServiceImpl();
	}
	private Object createMemberService() {
		// TODO Auto-generated method stub
		return new MemberServiceImpl();
	}
	private Object createReviewService() {
		// TODO Auto-generated method stub
		return new ReviewServiceImpl();
	}
}
